using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicFlowAPI.Data;
using ClinicFlowAPI.Models;
using ClinicFlowAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
namespace ClinicFlowAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CitaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CitaController(AppDbContext context)
        {
            _context = context;
        }

        private bool ObtenerClienteId(out int clienteId)
        {
            clienteId = 0;

            var clienteIdToken = User.FindFirst("ClienteId")?.Value;

            if (string.IsNullOrEmpty(clienteIdToken))
                return false;

            if (!int.TryParse(clienteIdToken, out clienteId))
                return false;

            return clienteId > 0;
        }

        [Authorize(Roles = "Cliente")]
        [HttpPost]
        public async Task<IActionResult> CrearCita([FromBody] CrearCitaDto citaDto)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == clienteId);

            if (!clienteExiste)
                return BadRequest("El cliente no existe.");

            var cita = new Cita
            {
                ClienteId = clienteId,
                FechaHora = citaDto.FechaHora,
                Motivo = citaDto.Motivo,
                Estado = "Pendiente",
                Observaciones = citaDto.Observaciones
            };

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        [Authorize(Roles = "Cliente")]
        [HttpGet("mis-citas")]
        public async Task<IActionResult> ObtenerMisCitas()
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            var citas = await _context.Citas
                .Where(c => c.ClienteId == clienteId)
                .OrderBy(c => c.FechaHora)
                .ToListAsync();

            return Ok(citas);
        }

        [Authorize(Roles = "Cliente")]
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerCitaPorId(int id)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            var cita = await _context.Citas
                .FirstOrDefaultAsync(c => c.Id == id && c.ClienteId == clienteId);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            return Ok(cita);
        }

        [Authorize(Roles = "Cliente")]
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCita(int id, [FromBody] CrearCitaDto citaDto)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cita = await _context.Citas
                .FirstOrDefaultAsync(c => c.Id == id && c.ClienteId == clienteId);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            cita.FechaHora = citaDto.FechaHora;
            cita.Motivo = citaDto.Motivo;
            cita.Observaciones = citaDto.Observaciones;

            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        [Authorize(Roles = "Cliente")]
        [HttpPatch("{id}/cancelar")]
        public async Task<IActionResult> CancelarCita(int id)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            var cita = await _context.Citas
                .FirstOrDefaultAsync(c => c.Id == id && c.ClienteId == clienteId);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            cita.Estado = "Cancelada";

            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/todas")]
        public async Task<IActionResult> ObtenerTodasLasCitas()
        {
            var citas = await _context.Citas
                .Include(c => c.Cliente)
                .OrderBy(c => c.FechaHora)
                .Select(c => new
                {
                    c.Id,
                    c.ClienteId,
                    ClienteNombre = c.Cliente.Nombre + " " + c.Cliente.PrimerApellido + " " + c.Cliente.SegundoApellido,
                    c.FechaHora,
                    c.Motivo,
                    c.Estado,
                    c.Observaciones
                })
                .ToListAsync();

            return Ok(citas);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("admin")]
        public async Task<IActionResult> CrearCitaAdmin([FromBody] CrearCitaAdminDto citaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == citaDto.ClienteId);

            if (!clienteExiste)
                return BadRequest("El cliente no existe.");

            var cita = new Cita
            {
                ClienteId = citaDto.ClienteId,
                FechaHora = citaDto.FechaHora,
                Motivo = citaDto.Motivo,
                Estado = string.IsNullOrWhiteSpace(citaDto.Estado) ? "Pendiente" : citaDto.Estado,
                Observaciones = citaDto.Observaciones
            };

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("admin/{id}")]
        public async Task<IActionResult> ActualizarCitaAdmin(int id, [FromBody] CrearCitaAdminDto citaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cita = await _context.Citas.FindAsync(id);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            var clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == citaDto.ClienteId);

            if (!clienteExiste)
                return BadRequest("El cliente no existe.");

            cita.ClienteId = citaDto.ClienteId;
            cita.FechaHora = citaDto.FechaHora;
            cita.Motivo = citaDto.Motivo;
            cita.Estado = string.IsNullOrWhiteSpace(citaDto.Estado) ? cita.Estado : citaDto.Estado;
            cita.Observaciones = citaDto.Observaciones;

            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("admin/{id}/estado")]
        public async Task<IActionResult> CambiarEstadoCitaAdmin(int id, [FromBody] string estado)
        {
            var cita = await _context.Citas.FindAsync(id);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            cita.Estado = estado;

            await _context.SaveChangesAsync();

            return Ok(cita);
        }
    }
}