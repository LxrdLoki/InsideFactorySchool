import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-from-category',
  imports: [],
  templateUrl: './all-from-category.html',
  styleUrl: './all-from-category.scss',
})
export class AllFromCategory implements OnInit {

  public category: string = '';
  public posts: any[] = [];

  constructor(
    public apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // get category from route
    this.category = this.route.snapshot.paramMap.get('subject') || '';

    console.log('category -> ', this.category);

    // fetch posts from backend
    this.apiService.getForumPosts(this.category).subscribe({
      next: (response) => {
        this.posts = response;
        console.log('Posts from category -> ', response);
      },
      error: (err) => {
        console.error('Error fetching posts from category -> ', err);
      }
    });
  }
}
