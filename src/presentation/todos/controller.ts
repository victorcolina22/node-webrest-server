import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

export class TodosController {
  // DI (Dependency injection)
  constructor() {}

  public async getTodos(req: Request, res: Response) {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  }

  public async getTodoById(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    const todo = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    res.json(todo);
  }

  public async createTodo(req: Request, res: Response) {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });
    res.json(todo);
  }

  public async updateTodo(req: Request, res: Response) {
    const id = +req.params.id;

    const [error, updateTodoDto] = UpdateTodoDto.update({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.findFirst({
      where: { id: id },
    });
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    const updatedTodo = await prisma.todo.update({
      where: {
        id: id,
      },
      data: updateTodoDto!.values,
    });
    res.json(updatedTodo);
  }

  public async deleteTodo(req: Request, res: Response) {
    const id = +req.params.id;

    const todo = await prisma.todo.findFirst({
      where: {
        id: id,
      },
    });
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    const deletedTodo = await prisma.todo.delete({
      where: {
        id: id,
      },
    });

    deletedTodo
      ? res.json(deletedTodo)
      : res.status(400).json({ error: `Todo with id ${id} not found` });
  }
}
