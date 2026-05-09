import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-from-category',
  imports: [CommonModule, RouterLink],
  templateUrl: './all-from-category.html',
  styleUrl: './all-from-category.scss',
  standalone: true
})
export class AllFromCategory implements OnInit {

  public category: string = '';
  public posts = signal<any[] | undefined>(undefined);

  constructor(
    public apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.category = this.route.snapshot.paramMap.get('subject') || '';

    this.apiService.getForumPosts(this.category).subscribe({
      next: (response) => {
        this.posts.set(response);
        console.log('posts -> ', this.posts());
      },
      error: (err) => {
        console.error('Error fetching posts -> ', err);
      }
    });
  }
}
