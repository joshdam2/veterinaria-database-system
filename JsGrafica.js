/* script.js
   Cliente que usa la API REST en http://localhost:3000
   - GET /entity
   - POST /entity
   - PUT /entity/:id  (editar)
   - DELETE /entity/:id
   UI:
   - Navegación tipo tabs entre secciones (Dueños, Mascotas, ...)
   - Editar rellena formulario; enviar en modo edición hace PUT; si no, POST.
*/

document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = 'http://localhost:3000'; // ajusta si tu servidor corre en otra URL/puerto

  // NAV / PANELS
  const navLinks = document.querySelectorAll('.nav-link');
  const panels = document.querySelectorAll('.panel');

  function showPanel(name, push=true){
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === name));
    if(push) history.replaceState(null, '', `#${name}`);
  }
  navLinks.forEach(a => a.addEventListener('click', e => { e.preventDefault(); showPanel(a.dataset.section); }));
  const initial = location.hash ? location.hash.replace('#','') : (panels[0] && panels[0].dataset.panel);
  if(initial) showPanel(initial, false);

  // Config por entidad: campos y primary key (nombres como en la DB/JSON)
  const entitiesConfig = {
    duenos: {
      tableId: 'tablaDuenos',
      formId: 'formDuenos',
      pk: 'id_dueno',
      fields: ['nombre','telefono','correo','direccion'],
      numericFields: []
    },
    mascotas: {
      tableId: 'tablaMascotas',
      formId: 'formMascotas',
      pk: 'id_mascota',
      fields: ['id_dueno','nombre','especie','raza','edad','genero'],
      numericFields: ['id_dueno','edad']
    },
    veterinarios: {
      tableId: 'tablaVeterinarios',
      formId: 'formVeterinarios',
      pk: 'id_veterinario',
      fields: ['nombre','especialidad','telefono','correo'],
      numericFields: []
    },
    servicios: {
      tableId: 'tablaServicios',
      formId: 'formServicios',
      pk: 'id_servicio',
      fields: ['nombre_servicio','descripcion','costo','duracion_minutos'],
      numericFields: ['costo','duracion_minutos']
    },
    citas: {
      tableId: 'tablaCitas',
      formId: 'formCitas',
      pk: 'id_cita',
      fields: ['id_mascota','id_veterinario','id_servicio','fecha','hora','estado'],
      numericFields: ['id_mascota','id_veterinario','id_servicio']
    },
    pagos: {
      tableId: 'tablaPagos',
      formId: 'formPagos',
      pk: 'id_pago',
      fields: ['id_cita','monto','metodo_pago','fecha_pago','estado'],
      numericFields: ['id_cita','monto']
    }
  };

  // Helpers API
  async function apiGet(entity){
    const res = await fetch(`${baseUrl}/${entity}`);
    if(!res.ok) throw new Error(`GET ${entity} failed: ${res.status}`);
    const data = await res.json();
    return data[entity] || data[Object.keys(data).find(k => Array.isArray(data[k]))] || [];
  }
  async function apiPost(entity, body){
    const res = await fetch(`${baseUrl}/${entity}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error(`POST ${entity} failed: ${res.status}`);
    return res.json();
  }
  async function apiPut(entity, id, body){
    const res = await fetch(`${baseUrl}/${entity}/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error(`PUT ${entity}/${id} failed: ${res.status}`);
    return res.json();
  }
  async function apiDelete(entity, id){
    const res = await fetch(`${baseUrl}/${entity}/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error(`DELETE ${entity}/${id} failed: ${res.status}`);
    return res.json();
  }

  // Render tabla de una entidad
  async function renderTable(entity){
    try {
      const cfg = entitiesConfig[entity];
      const data = await apiGet(entity);
      const tbody = document.querySelector(`#${cfg.tableId} tbody`);
      if(!tbody) return;
      tbody.innerHTML = '';
      data.forEach(row => {
        const tr = document.createElement('tr');
        // pk primero
        const pkVal = row[cfg.pk];
        const columns = [pkVal, ...cfg.fields.map(f => row[f])];
        columns.forEach(val => {
          const td = document.createElement('td');
          td.textContent = val ?? '';
          tr.appendChild(td);
        });
        // Acciones
        const tdAcc = document.createElement('td');
        const btnEdit = document.createElement('button');
        btnEdit.className = 'action-btn action-edit';
        btnEdit.textContent = 'Editar';
        btnEdit.addEventListener('click', () => enterEditMode(entity, row));
        const btnDel = document.createElement('button');
        btnDel.className = 'action-btn action-delete';
        btnDel.textContent = 'Eliminar';
        btnDel.addEventListener('click', async () => {
          if(!confirm(`¿Eliminar registro ID ${pkVal}?`)) return;
          try {
            await apiDelete(entity, pkVal);
            await renderTable(entity);
          } catch (err) {
            console.error(err);
            alert('Error al eliminar: ' + err.message);
          }
        });
        tdAcc.appendChild(btnEdit);
        tdAcc.appendChild(btnDel);
        tr.appendChild(tdAcc);
        tbody.appendChild(tr);
      });
    } catch (err){
      console.error(err);
    }
  }

  // Rellenar formulario y activar modo edición
  function enterEditMode(entity, row){
    const cfg = entitiesConfig[entity];
    const form = document.getElementById(cfg.formId);
    if(!form) return;
    // guardar id en dataset
    form.dataset.editId = row[cfg.pk];
    // rellenar inputs
    cfg.fields.forEach(f => {
      const input = form.elements[f];
      if(!input) return;
      // si campo tipos fecha/hora están en el row, poner valor directo
      input.value = row[f] ?? '';
    });
    // cambiar texto botón
    const addBtn = form.querySelector('.btn-add');
    if(addBtn){
      addBtn.textContent = 'Guardar cambios';
      addBtn.classList.add('editing');
    }
    // mostrar panel correspondiente
    showPanel(entity);
    // poner foco en primer input
    const firstInput = form.querySelector('input, select, textarea');
    if(firstInput) firstInput.focus();
  }

  // Salir de modo edición
  function exitEditMode(form){
    delete form.dataset.editId;
    const addBtn = form.querySelector('.btn-add');
    if(addBtn){
      addBtn.textContent = 'Agregar';
      addBtn.classList.remove('editing');
    }
    form.reset();
  }

  // Registrar formularios: submit -> POST o PUT según modo
  Object.keys(entitiesConfig).forEach(entity => {
    const cfg = entitiesConfig[entity];
    const form = document.getElementById(cfg.formId);
    if(!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const body = {};
      for(const field of cfg.fields){
        let val = formData.get(field);
        if(val === null) continue;
        if(cfg.numericFields && cfg.numericFields.includes(field) && val !== ''){
          // parse number (int o float)
          val = val.includes('.') ? parseFloat(val) : parseInt(val, 10);
        }
        body[field] = val;
      }

      try {
        if(form.dataset.editId){
          // editar (PUT)
          const id = form.dataset.editId;
          await apiPut(entity, id, body);
          exitEditMode(form);
        } else {
          // crear (POST)
          await apiPost(entity, body);
          form.reset();
        }
        await renderTable(entity);
        // feedback
        const btn = form.querySelector('.btn-add');
        if(btn){
          const prev = btn.textContent;
          btn.textContent = form.dataset.editId ? 'Guardado ✓' : 'Agregado ✓';
          setTimeout(()=> btn.textContent = form.dataset.editId ? 'Guardar cambios' : 'Agregar', 900);
        }
      } catch (err) {
        console.error(err);
        alert('Error al guardar: ' + err.message);
      }
    });

    // Botón eliminar por ID (el que estaba junto al formulario)
    const delBtn = form.querySelector('.btn-delete');
    if(delBtn){
      delBtn.addEventListener('click', async () => {
        const idStr = prompt(`Introduce el ID a eliminar en "${entity}":`);
        if(!idStr) return;
        const id = parseInt(idStr,10);
        if(isNaN(id)){
          alert('ID inválido.');
          return;
        }
        try {
          await apiDelete(entity, id);
          await renderTable(entity);
        } catch (err){
          console.error(err);
          alert('Error al eliminar: ' + err.message);
        }
      });
    }

    // Inicial render de la tabla
    renderTable(entity);
  });

  // Si quieres refrescar todas al inicio:
  // Object.keys(entitiesConfig).forEach(e => renderTable(e));
});