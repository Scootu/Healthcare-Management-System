# Multi-stage build for HealthCare API
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files first for better layer caching
COPY Healthcare.sln ./
COPY src/HealthCare.Api/HealthCare.Api.csproj src/HealthCare.Api/
COPY src/Healthcare.Application/Healthcare.Application.csproj src/Healthcare.Application/
COPY src/Healthcare.Contracts/Healthcare.Contracts.csproj src/Healthcare.Contracts/
COPY src/Healthcare.Domain/Healthcare.Domain.csproj src/Healthcare.Domain/

RUN dotnet restore src/HealthCare.Api/HealthCare.Api.csproj

# Copy source code and publish
COPY . .
RUN dotnet publish src/HealthCare.Api/HealthCare.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "HealthCare.Api.dll"]
