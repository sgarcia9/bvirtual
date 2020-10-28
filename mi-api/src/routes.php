<?php
// Routes
// Grupo de rutas para el API
$app->group('/api', function () use ($app) {
  // Version group
  $app->group('/v1', function () use ($app) {
    $app->get('/empleados', 'obtenerEmpleados');
    $app->get('/empleado/{id}', 'obtenerEmpleado');
    $app->post('/crear', 'agregarEmpleado');
    $app->put('/actualizar/{id}', 'actualizarEmpleado');
    $app->delete('/eliminar/{id}', 'eliminarEmpleado');
  });
});
