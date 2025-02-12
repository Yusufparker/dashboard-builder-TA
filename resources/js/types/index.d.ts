export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}
export interface Entity {
    id : number;
    name : string;
    project_id : number;
    uuid : string;
    created_at : Date;
    updated_at : Date;

}

export interface Project {
    id: number;
    uuid: string;
    name: string;
    description?: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    entities? : Entity[]
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    current_project: Project;
};
