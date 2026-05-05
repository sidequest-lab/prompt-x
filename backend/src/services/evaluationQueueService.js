const EvaluationTask = require("../models/EvaluationTask");
const logger = require("../config/logger");
const { evaluatePrompt } = require("./evaluationService");

const MAX_ATTEMPTS = 3;
let isProcessing = false;
let scheduledTimer = null;

function scheduleEvaluationProcessing(delayMs = 0) {
  if (scheduledTimer) {
    return;
  }

  scheduledTimer = setTimeout(async () => {
    scheduledTimer = null;
    await processEvaluationQueue();
  }, delayMs);

  if (typeof scheduledTimer.unref === "function") {
    scheduledTimer.unref();
  }
}

async function enqueuePromptEvaluation(promptId) {
  await EvaluationTask.findOneAndUpdate(
    { prompt: promptId },
    {
      $set: {
        status: "pending",
        attempts: 0,
        availableAt: new Date(),
        lastError: "",
        startedAt: null,
        completedAt: null,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  scheduleEvaluationProcessing();
}

async function claimNextTask() {
  return EvaluationTask.findOneAndUpdate(
    {
      status: "pending",
      availableAt: { $lte: new Date() },
    },
    {
      $set: {
        status: "processing",
        startedAt: new Date(),
      },
      $inc: {
        attempts: 1,
      },
    },
    {
      sort: { updatedAt: 1, createdAt: 1 },
      new: true,
    }
  );
}

async function processEvaluationQueue(limit = 25) {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  try {
    let processed = 0;

    while (processed < limit) {
      const task = await claimNextTask();

      if (!task) {
        break;
      }

      try {
        await evaluatePrompt(task.prompt);

        await EvaluationTask.findByIdAndUpdate(task._id, {
          status: "completed",
          lastError: "",
          completedAt: new Date(),
        });
      } catch (error) {
        const shouldRetry = task.attempts < MAX_ATTEMPTS;
        const retryDelayMinutes = Math.max(task.attempts, 1);

        await EvaluationTask.findByIdAndUpdate(task._id, {
          status: shouldRetry ? "pending" : "failed",
          lastError:
            error instanceof Error ? error.message.slice(0, 1000) : "Evaluation failed",
          availableAt: shouldRetry
            ? new Date(Date.now() + retryDelayMinutes * 60 * 1000)
            : new Date(),
          completedAt: shouldRetry ? null : new Date(),
        });

        logger.error("Evaluation queue job failed", {
          promptId: task.prompt.toString(),
          attempts: task.attempts,
          willRetry: shouldRetry,
          error: error.message,
        });
      }

      processed += 1;
    }
  } finally {
    isProcessing = false;
  }

  const pendingNow = await EvaluationTask.exists({
    status: "pending",
    availableAt: { $lte: new Date() },
  });

  if (pendingNow) {
    scheduleEvaluationProcessing();
  }
}

async function resumeEvaluationQueue() {
  scheduleEvaluationProcessing();
}

module.exports = {
  enqueuePromptEvaluation,
  processEvaluationQueue,
  resumeEvaluationQueue,
};
