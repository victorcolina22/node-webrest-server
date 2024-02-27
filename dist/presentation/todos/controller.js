"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosController = void 0;
const postgres_1 = require("../../data/postgres");
const dtos_1 = require("../../domain/dtos");
class TodosController {
    // DI (Dependency injection)
    constructor() { }
    getTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const todos = yield postgres_1.prisma.todo.findMany();
            res.json(todos);
        });
    }
    getTodoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            if (isNaN(id))
                return res.status(400).json({ error: "ID argument is not a number" });
            const todo = yield postgres_1.prisma.todo.findUnique({
                where: {
                    id: id,
                },
            });
            res.json(todo);
        });
    }
    createTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [error, createTodoDto] = dtos_1.CreateTodoDto.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const todo = yield postgres_1.prisma.todo.create({
                data: createTodoDto,
            });
            res.json(todo);
        });
    }
    updateTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [error, updateTodoDto] = dtos_1.UpdateTodoDto.update(Object.assign(Object.assign({}, req.body), { id }));
            if (error)
                return res.status(400).json({ error });
            const todo = yield postgres_1.prisma.todo.findFirst({
                where: { id: id },
            });
            if (!todo)
                return res.status(404).json({ error: `Todo with id ${id} not found` });
            const updatedTodo = yield postgres_1.prisma.todo.update({
                where: {
                    id: id,
                },
                data: updateTodoDto.values,
            });
            res.json(updatedTodo);
        });
    }
    deleteTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const todo = yield postgres_1.prisma.todo.findFirst({
                where: {
                    id: id,
                },
            });
            if (!todo)
                return res.status(404).json({ error: `Todo with id ${id} not found` });
            const deletedTodo = yield postgres_1.prisma.todo.delete({
                where: {
                    id: id,
                },
            });
            deletedTodo
                ? res.json(deletedTodo)
                : res.status(400).json({ error: `Todo with id ${id} not found` });
        });
    }
}
exports.TodosController = TodosController;
