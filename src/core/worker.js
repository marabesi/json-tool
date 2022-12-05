/* istanbul ignore file */
const onmessage = async (event) => {
  if (!event) {
    return;
  }

  const value = event.data.jsonAsString;
  const spacing = event.data.spacing;

  if (value) {
    // eslint-disable-next-line no-undef
    const format = await fmt2json(value, {
      expand: true,
      escape: false,
      indent: parseInt(spacing)
    });

    try {
      JSON.parse(value);
    } catch (e) {
      console.error('error from worker: ', e);
      postMessage({ error: true, originalJson: value, result: format.result });
      return;
    }

    postMessage({ error: false, originalJson: value, result: format.result });
    return;
  }
  // empty json was given
  postMessage({ error: false, originalJson: value, result: value });
};

export default onmessage;
