export class Todo {
        #id;

        constructor({ id = crypto.randomUUID(), title, priority = "medium", dueDate = "", done = false }) {
            this.#id = id;
            this.title = title.trim();
            this.priority = priority;   
            this.dueDate = dueDate;
            this.done = done;
        }

        get id() { return this.#id; }

        get isOverdue() {
            if (this.done || !this.dueDate) return false;
            return new Date(this.dueDate) < new Date(new Date().toDateString());
        }

        toggle() { this.done = !this.done; }

        update(changes) {
            const { id, ...merged } = { ...this.toJSON(), ...changes };
            Object.assign(this, merged);
        }

        toJSON() {
            const { title, priority, dueDate, done } = this;
            return { id: this.#id, title, priority, dueDate, done };
        }

        static fromJSON(obj) { return new Todo(obj); }
}