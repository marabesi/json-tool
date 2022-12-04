/* istanbul ignore file */
const onmessage = async (e) => {
  if (!e) {
    return;
  }

  const value = e.data.jsonAsString;
  const spacing = e.data.spacing;

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
