const eventSources = {};

function createEventSource(url, onMessage, onOpen, onError) {
  const eventSource = new EventSource(url);

  eventSource.addEventListener("message", event =>
    onMessage(JSON.parse(event.data))
  );
  eventSource.addEventListener("open", onOpen);
  eventSource.addEventListener("error", onError);

  return eventSource;
}

export function addEventSource(id, url, onMessage, onOpen, onError) {
  if (eventSources[id]) {
    return;
  }
  const eventSource = createEventSource(url, onMessage, onOpen, onError);
  eventSources[id] = eventSource;
}

export function removeEventSource(id) {
  if (!eventSources[id]) {
    return;
  }

  const eventSource = eventSources[id];
  eventSource.close();
  delete eventSources[id];
}
