using Microsoft.AspNetCore.Mvc;
using ClinicFlowAPI.Models;
using ClinicFlowAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace ClinicFlowAPI.Controllers
{
    //convierte la clase en API
    [ApiController] 

    //cuando ingresen a api clientes ejecute este controller
    [Route("api/[controller]")]

    public class ClientesController : ControllerBase
    {

        //conexión a la BD
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        /// Obtiene la lista completa de clientes registrados.
        [HttpGet]
        public async Task<IActionResult> ObtenerClientes()
        {
            var clientes = await _context.Clientes.ToListAsync();
            return Ok(clientes);
        }

        /// Registra un nuevo cliente en la lista.
        [HttpPost]
        public async Task<IActionResult> CrearCliente([FromBody] Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return Ok(cliente);
        }

        /// Actualiza la información de un cliente existente.
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCliente(int id, [FromBody] Cliente clienteActualizado)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return NotFound("Cliente no encontrado.");

            cliente.Nombre = clienteActualizado.Nombre;
            cliente.PrimerApellido = clienteActualizado.PrimerApellido;
            cliente.SegundoApellido = clienteActualizado.SegundoApellido;
            cliente.Email = clienteActualizado.Email;
            cliente.Telefono = clienteActualizado.Telefono;
            cliente.Activo = clienteActualizado.Activo;

            await _context.SaveChangesAsync();

            return Ok(cliente);
        }

        /// Inactiva un cliente existente según el Id
        [HttpPut("{id}/inactivar")]
        public async Task<IActionResult> InactivarCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return NotFound("Cliente no encontrado.");

            cliente.Activo = false;

            await _context.SaveChangesAsync();

            return Ok("Cliente inactivado correctamente.");
        }

        [HttpPut("{id}/activar")]
        public async Task<IActionResult> ActivarCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return NotFound("Cliente no encontrado.");

            cliente.Activo = true;

            await _context.SaveChangesAsync();

            return Ok("Cliente activado correctamente.");
        }
    }
}