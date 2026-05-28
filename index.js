const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

//Documentación en https://expressjs.com/en/starter/hello-world.html
const app = express()

//Creamos un parser de tipo application/json
//Documentación en https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json()

// Abre la base de datos (Nota: Para tests reales, se suele usar ':memory:' o una DB de test)
const db = new sqlite3.Database('./base.sqlite3', (err) => {
    if (err) {
            console.error(err.message);
                }
                    // console.log('Conectado a la base de datos SQLite.'); // Comentado para limpiar salida de tests

                        db.run(`CREATE TABLE IF NOT EXISTS todos (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        todo TEXT NOT NULL,
                                                created_at INTEGER
                                                    )`);
                                                    });

                                                    // --- ENDPOINTS ---

                                                    app.post('/agrega_todo', jsonParser, function (req, res) {
                                                        const { todo } = req.body;

                                                        if (!todo || todo.trim() === '') {
                                                            return res.status(400).json({ error: 'Falta información necesaria' });
                                                        }

                                                        const createdAt = Math.floor(Date.now() / 1000);

                                                        const stmt = db.prepare('INSERT INTO todos (todo, created_at) VALUES (?, ?)');

                                                        stmt.run(todo, createdAt, function(err) {
                                                            if (err) {
                                                                return res.status(500).json({ error: err.message });
                                                            }

                                                            res.status(201).json({
                                                                id: this.lastID,
                                                                message: 'Información del registro guardado correctamente',
                                                                todo: todo,
                                                                created_at: createdAt
                                                            });
                                                        });

                                                        stmt.finalize();
                                                    });
                                                    // NUEVO ENDPOINT PARA LISTAR TODOS
                                                    app.get('/lista_todos', function (req, res) {
                                                        db.all('SELECT * FROM todos ORDER BY id DESC', [], (err, rows) => {
                                                            if (err) {
                                                                return res.status(500).json({ error: err.message });
                                                            }

                                                            res.status(200).json(rows);
                                                        });
                                                    });

                                                    app.get('/', function (req, res) {
                                                        res.status(200).json({ 'status': 'ok' });
                                                        });

                                                        app.post('/login', jsonParser, function (req, res) {
                                                            res.status(200).json({ 'status': 'ok' });
                                                            });

                                                            // --- INICIO DEL SERVIDOR ---

                                                            // Solo escuchamos el puerto si este archivo es el principal (no es un test)
                                                            if (require.main === module) {
                                                                const port = process.env.PORT || 3000;
                                                                    app.listen(port, () => {
                                                                            console.log(`Aplicación corriendo en http://localhost:${port}`);
                                                                                });
                                                                                }

                                                                                // Exportamos app y db para usarlos en los tests
                                                                                module.exports = { app: app, db };