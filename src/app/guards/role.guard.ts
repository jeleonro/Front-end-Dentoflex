import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '../services/auth.service';

export function roleGuard(...roles: Rol[]): CanActivateFn {
    return () => {
        const router = inject(Router);
        const token = localStorage.getItem('access_token');
        const rol = localStorage.getItem('rol') as Rol | null;

        if (!token) {
            router.navigateByUrl('/login');
            return false;
        }

        if (!rol || !roles.includes(rol)) {
            const home = rol === 'dentista' ? '/dentista/home' : '/main';
            router.navigateByUrl(home);
            return false;
        }

        return true;
    };
}