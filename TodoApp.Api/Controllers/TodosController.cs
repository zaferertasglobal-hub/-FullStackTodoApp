using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly AppDbContext _context;

    public TodosController(AppDbContext context) => _context = context;

    [HttpGet] public async Task<ActionResult<IEnumerable<TodoItem>>> Get() => await _context.Todos.ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> Get(int id)
    {
        var item = await _context.Todos.FindAsync(id);
        return item == null ? NotFound() : item;
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> Post(TodoItem item)
    {
        _context.Todos.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, TodoItem item)
    {
        if (id != item.Id) return BadRequest();
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Todos.FindAsync(id);
        if (item == null) return NotFound();
        _context.Todos.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}