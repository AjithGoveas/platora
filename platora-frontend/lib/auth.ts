export type Role = 'customer' | 'restaurant' | 'delivery' | 'admin';

export type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
};

const USER_KEY = 'platora_user';

let currentUser: User | null = null;

export function login(email: string, password: string): Promise<User> {
    // Mock login: always succeeds
    return new Promise((resolve) => {
        const mockUser: User = {
            id: 'USR001',
            name: 'Ajith',
            email,
            role: inferRoleFromEmail(email),
        };
        currentUser = mockUser;
        saveUser(mockUser);
        resolve(mockUser);
    });
}

export function logout(): Promise<void> {
    return new Promise((resolve) => {
        currentUser = null;
        localStorage.removeItem(USER_KEY);
        resolve();
    });
}

export function getCurrentUser(): User | null {
    if (currentUser) return currentUser;

    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
    }

    return null;
}

function saveUser(user: User | null) {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
}

function inferRoleFromEmail(email: string): Role {
    if (email.includes('admin')) return 'admin';
    if (email.includes('restaurant')) return 'restaurant';
    if (email.includes('delivery')) return 'delivery';
    return 'customer';
}

export function useAuthGuard(requiredRole?: Role) {
    const user = getCurrentUser();

    if (!user) return { allowed: false, reason: 'unauthenticated' };
    if (requiredRole && user.role !== requiredRole)
        return { allowed: false, reason: 'unauthorized' };

    return { allowed: true, user };
}
