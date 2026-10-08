(function (root) {
  'use strict';
  function creationTime(order) {
    const value = order.createdAt;
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value))) return new Date(value).toISOString();
    // Older fallback IDs contain the original Date.now() value; UUIDs do not.
    const match = /^pedido-(\d{13})$/.exec(order.id || '');
    return match ? new Date(Number(match[1])).toISOString() : null;
  }
  function publicationLabel(order) {
    const createdAt = creationTime(order);
    if (!createdAt) return 'SIN ESPECIFICAR';
    const parts = new Intl.DateTimeFormat('es-UY', {timeZone:'America/Montevideo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(createdAt));
    const values = Object.fromEntries(parts.map(p => [p.type,p.value]));
    return `${values.day}/${values.month}/${values.year} · ${values.hour}:${values.minute}`;
  }
  function orderStatus(order) {
    if(order.status==='completed')return 'FINALIZADO';
    if(order.status==='archived'||((['Hoy','Ahora'].includes(order.urgency)&&Number.isFinite(Date.parse(order.created_at||order.createdAt))&&Date.parse(order.created_at||order.createdAt)+86400000<=Date.now())||(order.urgency==='Esta semana'&&Number.isFinite(Date.parse(order.created_at||order.createdAt))&&Date.parse(order.created_at||order.createdAt)+604800000<=Date.now())))return 'ARCHIVADO';
    return 'PENDIENTE';
  }
  function normalizeOrder(order) {
    const normalized = {...order, createdAt:creationTime(order)};
    delete normalized.displayStatus;
    delete normalized.timeLabel;
    return normalized;
  }
  const api = {creationTime,publicationLabel,orderStatus,normalizeOrder};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PiqueOrderData = api;
})(globalThis);
