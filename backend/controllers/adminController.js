export const getHealth = async (_req, res) => {
  return res.json({ ok: true, service: 'sentinel-3-backend' });
};


