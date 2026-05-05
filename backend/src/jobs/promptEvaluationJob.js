const logger = require("../config/logger");
const {
  enqueuePromptEvaluation,
  resumeEvaluationQueue,
} = require("../services/evaluationQueueService");

function triggerPromptEvaluation(promptId) {
  enqueuePromptEvaluation(promptId).catch((error) => {
    logger.error("Failed to enqueue prompt evaluation", {
      promptId,
      error: error.message,
    });
  });
}

module.exports = {
  triggerPromptEvaluation,
  resumeEvaluationQueue,
};
