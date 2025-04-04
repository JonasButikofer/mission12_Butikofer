using Microsoft.EntityFrameworkCore;
using Mission11.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://purple-dune-01288281e.6.azurestaticapps.net"  // ← no slash here
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});




builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

var app = builder.Build();

app.UseCors("AllowLocalhost3000");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend"); 

app.UseAuthorization();
app.MapControllers();

// Database connection test
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<BookDbContext>();

    try
    {
        dbContext.Database.OpenConnection();
        Console.WriteLine("Database connection successful!");
        dbContext.Database.CloseConnection();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection failed: {ex.Message}");
    }
}

app.Run();
