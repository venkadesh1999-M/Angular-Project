import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
  const uid = localStorage.getItem('uid');
  // const roleStr = localStorage.getItem('role');
  // const role = parseInt(roleStr !== null ? roleStr : '0');
  const role = localStorage.getItem("role")
  console.log('User ID:', uid, 'Role:', role,typeof role);

  // return role === "1" ? true : false;

  if (role === "1") {
      return true;
    }

    // If role is "3", redirect to 404
    if (role === "3") {
      this.router.navigate(['/404']);
      return false;
    }
    
    return false;

}
}
