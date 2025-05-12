import { AdminUserWithProfessionalId } from 'types/admin.user.type';

export function formatUserResponse(user: AdminUserWithProfessionalId) {
  const response = {
    id: user.id,
    professionalId: user.professional ? user.professional!.id : null,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    userType: user.user_type,
    status: user.status,
  };

  return response;
}
