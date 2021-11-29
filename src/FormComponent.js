/* eslint-disable */
function TableComponent() {
  function initialConfigDataTable({ headers, data }) {
    const columns = [];
    const columnDefs = [];
    headers.forEach(({
      title, value, orderable = true, searchable = true, render = false,
    }, index) => {
      if (typeof render === 'function') {
        columns.push({ title, data: [value], render });
      } else {
        columns.push({ title, data: [value] });
      }
      if (!orderable || !searchable) {
        columnDefs.push({ targets: [index], searchable, orderable });
      }
    });
    return [columns, columnDefs];
  }

  const [columns, columnDefs] = initialConfigDataTable({ headers });

  document.addEventListener('alpine:init', () => {
    new DataTable('#table', {
      processing: true,
      deferRender: true,
      columns,
      columnDefs,
      data,
    });
    Alpine.data('tablecontainer', () => ({
      id: '',
      editItem(value) {
        this.id = Object.values(data[value]).join(' ');
      },
    }));
  });
}

