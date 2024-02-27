export class UpdateTodoDto {
  constructor(
    public readonly id: number,
    public readonly text?: string,
    public readonly completedAt?: Date
  ) {}

  get values() {
    const returnObj: Record<string, any> = {};

    if (this.text) returnObj.text = this.text;
    if (this.completedAt) returnObj.completedAt = this.completedAt;

    return returnObj;
  }

  static update(props: Record<string, any>): [string?, UpdateTodoDto?] {
    const { id, text, completedAt } = props;
    let newCompletedAt = completedAt;

    if (!id || isNaN(Number(id))) {
      return ["ID must be a valid number", undefined];
    }

    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (newCompletedAt.toString() === "Invalid Date") {
        return ["CompletedAt must be a valid date", undefined];
      }
    }

    return [undefined, new UpdateTodoDto(id, text, newCompletedAt)];
  }
}
