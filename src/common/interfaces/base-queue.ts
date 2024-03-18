// import {
//   OnQueueActive,
//   OnQueueEvent,
//   BullQueueEvents,
//   OnQueueError,
//   OnQueueFailed,
// } from '@nestjs/bull';
// import { Logger } from '@nestjs/common';
// import { Job } from 'bull';
// import { DebugLevel } from '../constants';
// import { SlackWebhook } from '../slack';

// export abstract class BaseQueueProcessor {
//   protected abstract logger: Logger;

//   constructor(protected slackWebhook: SlackWebhook) {}

//   @OnQueueError()
//   async errorHandler(error: Error) {
//     console.log('fired exception', error);
//     await this.slackWebhook.send({
//       level: DebugLevel.ERROR,
//       description: `OnQueueError:: ${error.name} - ${error.message}`,
//       attachment: { stackTrace: error.stack },
//     });
//   }

//   @OnQueueFailed()
//   async jobErrorHandler(job: Job, error: Error) {
//     console.log('job exception occurred...', job, error);
//     await this.slackWebhook.send({
//       level: DebugLevel.ERROR,
//       description: `OnQueueFailed:: ${error.name} - ${error.message}`,
//       attachment: { job, stackTrace: error.stack },
//     });
//   }

//   @OnQueueActive()
//   onActive(job: Job) {
//     this.logger.log(
//       `Processing job ${job.id} of type ${
//         job.name
//       } with data \n ${JSON.stringify(job.data, null, 2)}...`,
//     );
//   }

//   @OnQueueEvent(BullQueueEvents.COMPLETED)
//   onCompleted(job: Job) {
//     this.logger.log(
//       `Completed job ${job.id} of type ${job.name} with result ${JSON.stringify(
//         job.returnvalue,
//         null,
//         2,
//       )}`,
//     );
//   }
// }
