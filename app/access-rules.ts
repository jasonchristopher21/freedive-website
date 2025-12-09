import { AccessRole, User } from "@prisma/client";


const roleToValue = (v: AccessRole) => {
    switch (v) {
        case "ADMIN":
            return 2;
        case "IC":
            return 1;
        case "MEMBER":
        case "PENDING":
            return 0;
        default:
            console.log("Invalid Role supplied to roleToValue")
            return 0;
    }
};

export const compareRolesTo = (v1: AccessRole, v2: AccessRole) => {
    return roleToValue(v1) - roleToValue(v2);
};


type Role = AccessRole

// The permission for the feature is either a boolean value 
// or a function that takes in data with type defined within the keyof Permissions.
type PermissionCheck<Key extends keyof Permissions> =
    | boolean
    | ((user: User, data: Permissions[Key]["dataType"]) => boolean)



// For each role, define the features, and their corresponding permission value or functions
type RolesWithPermissions = {
    [R in Role]: Partial<{
        [Key in keyof Permissions]: Partial<{
            [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
        }>
    }>
}

type Permissions = {
    users: {
        dataType: User
        action: "view-users" | "edit-user" | "edit-user-access-role" | "remove"
    },
    settings: {
        dataType: User
        action: "view" | "update" | "delete"
    },
}


const ROLES = {
    ADMIN: {
        users: {
            "view-users": true, "edit-user": true, "edit-user-access-role": true, remove: true
        },
        settings: {
            view: true, update: true, delete: true
        }
    },
    IC: {
    },
    MEMBER: {

    },
    PENDING: {},
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
    user: User,
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
) {
    const role = user.accessRole
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
    if (permission == null) return false

    if (typeof permission === "boolean") return permission
    return data != null && permission(user, data)
}