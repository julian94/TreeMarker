using System.Net.Mime;
using System.Text;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

var collection = new FeatureCollection
{
    Type = "FeatureCollection",
    Features = new List<PointFeature>()
};

collection.Features.Add(new PointFeature
{
    Type = "Feature",
    Geometry = new PointGeometry
    {
        Type = "Point",
        Coordinates = new() { 5.22, 62.025 },
    },
    Properties = null,
});

//var url = app.Urls.First();
var site = File.ReadAllText("../dist/index.html");//.Replace("http://localhost:5242", url);

app.MapGet("/", (HttpContext context) =>
{
    context.Response.ContentType = MediaTypeNames.Text.Html;
    context.Response.ContentLength = Encoding.UTF8.GetByteCount(site);
    return site;
});

app.MapGet("/features", () =>
{
    return collection;
})
.WithName("GetFeatures");

app.MapPost("/features", (FeatureCollection data) =>
{
    foreach (var feature in data.Features) collection.Features.Add(feature);
})
.WithName("PutFeature");

app.Run();

class FeatureCollection
{
    public string Type { get; set; }

    public List<PointFeature> Features { get; set; }
}

class PointFeature
{
    public string Type { get; set; }

    public PointGeometry Geometry { get; set; }

    public Dictionary<string, object> Properties { get; set; }
}

class PointGeometry
{
    public string Type { get; set; }

    public List<double> Coordinates { get; set; }
}
