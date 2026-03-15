import { userManagementService } from "@/services/UserManagementService";

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error happened!";
}

export async function getAllUsersByRoleAction(roleId?: number) {
    try {
        const response = await userManagementService.getAll(roleId);
        return { data: response, error: null };
    } catch (error: unknown) {
        return { data: null, error: getErrorMessage(error) };
    }
}