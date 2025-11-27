// GIF.js requires a worker script. Since we are in a bundler-less environment or single-file output constraint,
// we create a Blob URL for the worker code.

const workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js');
`;

let workerUrl: string | null = null;

export const getWorkerUrl = () => {
  if (!workerUrl) {
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerUrl = URL.createObjectURL(blob);
  }
  return workerUrl;
};
