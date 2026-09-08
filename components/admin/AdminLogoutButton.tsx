import { logout } from "@/app/admin/(auth)/login/actions";

export default function AdminLogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm hover:text-[#C9A882] transition-colors cursor-pointer"
      >
        Logout
      </button>
    </form>
  );
}
