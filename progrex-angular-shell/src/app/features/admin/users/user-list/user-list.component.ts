import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // For routerLink in template
import { UserService } from '../../../../core/services/user.service'; // Adjusted path
import { User } from '../../../../core/models/user.model'; // Adjusted path

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public users: User[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'Failed to load users. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  deleteUser(userId: number): void {
    // Placeholder for delete functionality
    console.log(`Attempting to delete user with ID: ${userId}`);
    // In a real app, you would call userService.deleteUser(userId) and handle response
    // For example:
    // this.userService.deleteUser(userId).subscribe({
    //   next: () => {
    //     this.loadUsers(); // Refresh list after delete
    //     // Show success message
    //   },
    //   error: (err) => {
    //     // Show error message
    //   }
    // });
    alert(`Placeholder: Delete user ${userId}`);
  }
}
