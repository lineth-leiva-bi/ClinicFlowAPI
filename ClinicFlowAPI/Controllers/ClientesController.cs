using Microsoft.AspNetCore.Mvc;
using ClinicFlowAPI.Models;

namespace ClinicFlowAPI.Controllers
{
    //convierte la clase en API
    [ApiController] 

    //cuando ingresen a api clientes ejecute este controller
    [Route("api/[controller]")]

    public class ClientesController : ControllerBase
    {

        private static List<Cliente> clientes = new List<Cliente>
        {
            new Cliente
            {
                Id = 1,
                Nombre = "Jacqueline",
                PrimerApellido = "Vargas",
                SegundoApellido = "Mora",
                Email = "jacqueline@gmail.com",
                Telefono = "8888-1111"
            }
        };

        /// Obtiene la lista completa de clientes registrados.
        [HttpGet]
        public IActionResult ObtenerClientes()
        {
            return Ok(clientes);
        }

        /// Registra un nuevo cliente en la lista.
        [HttpPost]
        public IActionResult CrearCliente([FromBody] Cliente cliente)
        {

            //validar que el objeto no este vacío
            if (cliente == null)
                return BadRequest( "El cliente es requerido" );

            //valida obligatorias
            if (string.IsNullOrWhiteSpace(cliente.Nombre))
                return BadRequest("El nombre es obligatorio");

            if (string.IsNullOrWhiteSpace(cliente.PrimerApellido))
                return BadRequest("El primer apellido es obligatorio");

            if (string.IsNullOrWhiteSpace(cliente.Nombre))
                return BadRequest("El segundo apellido es obligatorio");

            if (string.IsNullOrWhiteSpace(cliente.Email))
                return BadRequest("El correo electrónico es obligatorio");

            cliente.Id = clientes.Count + 1;

            clientes.Add(cliente);

            //retorna 201 
            return CreatedAtAction(nameof(ObtenerClientes), new {id = cliente.Id}, cliente);
        }
    }
}