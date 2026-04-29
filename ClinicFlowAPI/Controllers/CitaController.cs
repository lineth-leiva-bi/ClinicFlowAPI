using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicFlowAPI.Data;
using ClinicFlowAPI.Models;
using ClinicFlowAPI.DTOs;

namespace ClinicFlowAPI.Controllers
{
    //convierte la clase en API
    [ApiController]

    //cuando ingresen a api cita ejecute este controller
    [Route("api/[controller]")]

    public class CitaController : ControllerBase
    {

        //conexión a la BD
        private readonly AppDbContext _context;

        public CitaController(AppDbContext context) {   

            _context = context;

        }

        //Crear cita, validando que los datos sean correctos y crea la cita 
        [HttpPost]
        public async Task<IActionResult> CrearCita([FromBody] CrearCitaDto citaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var clienteExiste = await _context.Clientes
                .AnyAsync(c => c.Id == citaDto.ClienteId);

            if (!clienteExiste)
                return BadRequest("El cliente no existe.");

            var cita = new Cita
            {
                ClienteId = citaDto.ClienteId,
                FechaHora = citaDto.FechaHora,
                Motivo = citaDto.Motivo,
                Estado = citaDto.Estado,
                Observaciones = citaDto.Observaciones
            };

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            return Ok(cita);
        }

    }
}
