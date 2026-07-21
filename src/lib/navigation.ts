import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListTodo,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Proyectos", href: "/proyectos", icon: FolderKanban },
  { label: "Tareas", href: "/tareas", icon: ListTodo },
  { label: "Empleados", href: "/empleados", icon: UserCircle },
];
