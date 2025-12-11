import { AccessRole, User } from "@prisma/client";

// This file handles the logic for determining whether the current logged in user has the ability to perform
// an action, as defined in this file, based on their access role.

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
    | ((currUser: User, data: Permissions[Key]["dataType"]) => boolean)



// For each role, define the features, and their corresponding permission value or functions
type RolesWithPermissions = {
    [R in Role]: Partial<{
        [Key in keyof Permissions]: Partial<{
            [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
        }>
    }>
}

// Define the additional data type needed if any, and the available user actions.
type Permissions = {
    sessions: {
        dataType: Pick<User,"id">,
        action: "remove-attendee"
    },
    users: {
        dataType: Pick<User,"id">
        action: "view-users" | "edit-user" | "edit-user-access-role" | "remove"
    },
    settings: {
        dataType: null
        action: "view" | "update" | "delete-account"
    },
}

const CannotEditSelf = (user: User, resource: Pick<User,"id">) => user.id !== resource.id
const OnlySelf = (user: User, resource: Pick<User,"id">) => user.id === resource.id

// Define the logic for determining user permissions based on their role
const ROLES = {
    ADMIN: {
        sessions: {
            "remove-attendee": true
        },
        users: {
            "view-users": true, "edit-user": true, "edit-user-access-role": true, remove: CannotEditSelf
        },
        settings: {
            view: true, update: true, "delete-account": true
        }
    },
    IC: {
        sessions: {
            "remove-attendee": true
        },
        users: {
            "view-users": true, "edit-user": true, "edit-user-access-role": true, remove: CannotEditSelf
        },
        settings: {
            view: true, update: true, "delete-account": true
        }
    },
    MEMBER: {
        sessions: {
            "remove-attendee": OnlySelf
        },
        users: {
            "view-users": true
        }
    },
    PENDING: {},
} as const satisfies RolesWithPermissions

/**
 * Checks whether the current logged in user has the permission to execute the specified action,
 * based on their access role and the rules located in the file of this function.
 * @param user The current logged in user
 * @param resource The access category, typically the page location
 * @param action The type of action under the specified resource
 * @param data May be used to determine more complex user permissions
 * @returns boolean
 */
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