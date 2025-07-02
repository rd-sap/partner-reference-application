'use strict';
// Implementation of generated AI reuse functions
// Include utility files
const { httpCodes } = require('./codes');

class GenAI {
  chatClient;
  // TODO4
  // Add prompt information
  static AI_PROMPT_INTRO = '';
  static AI_PROMPT_RHYME = '';
  static AI_PROMPT_LANGUAGE = '';

  // Defines the large language model that is used
  static MODEL_NAME = 'gpt-4o';
  static AI_RESOURCE_GROUP = 'default';

  async initializeModels() {
    const { AzureOpenAiChatClient } = await import(
      '@sap-ai-sdk/foundation-models'
    );

    // For a chat client
    this.chatClient = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
  }

  // Creates a configuration for a SAP AI Core service deployment
  async createConfiguration(req) {
    const { ConfigurationApi } = await import('@sap-ai-sdk/ai-api');
    const configurationBaseData = {
      name: GenAI.MODEL_NAME,
      executableId: 'azure-openai',
      scenarioId: 'foundation-models',
      parameterBindings: [
        {
          key: 'modelName',
          value: GenAI.MODEL_NAME
        },
        {
          key: 'modelVersion',
          value: 'latest'
        }
      ],
      inputArtifactBindings: []
    };

    try {
      const configurationCreationResponse =
        await ConfigurationApi.configurationCreate(configurationBaseData, {
          'AI-Resource-Group': GenAI.AI_RESOURCE_GROUP
        }).execute();
      return configurationCreationResponse;
    } catch (errorData) {
      console.error(
        'CREATE_WITH_AI: Configuration creation not possible: ',
        errorData.message
      );
      req.error(
        httpCodes.internal_server_error,
        `Configuration creation failed: ${errorData.message}`
      );
    }
  }

  // Creates a deployment of the SAP AI Core service
  async createDeployment(configId, req) {
    if (!configId) {
      console.error(
        'CREATE_WITH_AI: Deployment creation failed: Configuration ID missing'
      );
      req.error(
        httpCodes.internal_server_error,
        `Deployment creation failed: Configuration ID missing`
      );
    }
    const { DeploymentApi } = await import('@sap-ai-sdk/ai-api');
    const deploymentCreationRequest = {
      configurationId: configId
    };

    try {
      const deploymentCreationResponse = await DeploymentApi.deploymentCreate(
        deploymentCreationRequest,
        { 'AI-Resource-Group': GenAI.AI_RESOURCE_GROUP }
      ).execute();
      return deploymentCreationResponse;
    } catch (errorData) {
      console.error(
        'CREATE_WITH_AI: Deployment creation not possible: ',
        errorData.message
      );
      req.error(
        httpCodes.internal_server_error,
        `Deployment creation failed: ${errorData.message}`
      );
    }
  }

  // Reads the SAP AI Core service deployments
  async getDeployments(req) {
    const { DeploymentApi } = await import('@sap-ai-sdk/ai-api');
    try {
      const response = await DeploymentApi.deploymentQuery(
        { executableIds: ['azure-openai'], scenarioId: 'foundation-models' },
        { 'AI-Resource-Group': GenAI.AI_RESOURCE_GROUP }
      ).execute();
      return JSON.stringify(response.resources);
    } catch (errorData) {
      console.error(
        'CREATE_WITH_AI: Deployments cannot be read: ',
        errorData.message
      );
      req.error(
        httpCodes.internal_server_error,
        `Deployments cannot be read: ${errorData.message}`
      );
    }
  }

  // Check if the deployment does already exist if not create one
  async checkAndCreateDeployment(req) {
    try {
      const deployment = JSON.parse(await this.getDeployments(req));

      if (deployment.length === 0) {
        const config = await this.createConfiguration(req);
        await this.createDeployment(config.id, req);
        req.info(httpCodes.internal_server_error, 'ACTION_AI_SETUP');
        console.log('CREATE_WITH_AI: Deployment will be created.');
        return false;
      } else if (deployment[0].status !== 'RUNNING') {
        req.info(httpCodes.internal_server_error, 'ACTION_AI_SETUP');
        console.log('CREATE_WITH_AI: Deployment not yet running.');
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }

  // Calls AI LLM
  async callAI(tags, language, rhyme, req) {
    if (!tags?.trim() || !language || tags?.trim().length <= 0) {
      console.error(
        'CREATE_WITH_AI: Mandatory parameters language or tags missing.'
      );
      req.error(httpCodes.bad_Request, 'ACTION_AI_MISSING_PARAMETERS');
      return;
    }

    // TODO5
    // Build and send a prompt to the LLM
    // Log the token usage
    // Parse the response to a valid JSON format

    return;
  }

  // Creates a poetry slam with AI data and shows it as draft
  static async createPoetrySlamWithAI(aiResult, req, srv, db) {
    // TODO6
    // Create and return a draft entity of a Poetry Slam based on the given result of the call to the LLM


    
    return null;
  }
}

// Publish class
module.exports = GenAI;