import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-post',
  imports: [],
  templateUrl: './single-post.html',
  styleUrl: './single-post.scss',
})
export class SinglePost implements OnInit {
  public postId: string = '';
  public post = signal<any | undefined>(undefined);

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') || '';

    this.apiService.getSinglePost(this.postId).subscribe({
      next: (response) => {
        this.post.set(response);
        console.log('post -> ', response);
      },
      error: (err) => {
        console.error('Error fetching post -> ', err);
      }
    });
  }

  public createComment(event: Event, text: string) {
    event.preventDefault();

    this.apiService.createComment(Number(this.postId), text).subscribe({
      next: (response) => {
        console.log('Comment created -> ', response);

        // refresh post to get the new comment
        this.apiService.getSinglePost(this.postId).subscribe((updatedPost) => {
          this.post.set(updatedPost);
        });
      },
      error: (err) => {
        console.error('Error creating comment -> ', err);
      }
    });
  }
}
