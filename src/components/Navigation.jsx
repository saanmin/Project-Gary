'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm px-4 py-3 rounded-2xl z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center ml-2 font-semibold">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={37}
            height={14}
            className="mt-[7px] mr-2"
          />
          계리플랫폼
        </Link>

        <div className="flex space-x-4">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full ${pathname === '/'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            Input
          </Link>
          <Link
            href="/history"
            className={`px-4 py-2 rounded-full ${pathname === '/history'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            History
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 ml-16 focus:outline-none">
              <Avatar>
                <AvatarImage src="/avatars/garykim.png" alt="@garykim" />
                <AvatarFallback>GK</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">garykim</p>
                <p className="text-xs leading-none text-slate-500">gary@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                Preferences
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navigation;
