export const toUserResponse = (user) => {
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        avatarUrl: user.avatarUrl,
        role: user.role,
        accountType: user.accountType,
        isActive: user.isActive,
    };
}