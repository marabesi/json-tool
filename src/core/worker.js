const onmessage = (e) => {
  const value = e.data.jsonAsString;

  if (value) {
    try {
      JSON.parse(value);
    } catch (e) {
      postMessage({ error: true, originalJson: value });
      return;
    }

    postMessage({ error: false, originalJson: value });
    return;
  }
  // empty json was given
  postMessage({ error: false, originalJson: value });
};

export default onmessage;
