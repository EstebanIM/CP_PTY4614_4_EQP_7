export const handleRutChange = (e, setRut) => {
    let value = e.target.value.replace(/[^0-9kK]/g, "");
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length > 1 && !value.includes('-')) {
      value = value.slice(0, value.length - 1) + '-' + value.slice(value.length - 1);
    }
    setRut(value);
  };
  