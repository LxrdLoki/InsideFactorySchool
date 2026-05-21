import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-new-forum-post',
  imports: [ReactiveFormsModule],
  templateUrl: './new-forum-post.html',
  styleUrl: './new-forum-post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewForumPost implements OnInit {
  private formBuilder = inject(FormBuilder);
  public postError = signal<string | null>(null);

  constructor(public apiService: ApiService) { }

  public forumForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(6)]],
    subject: ['', [Validators.required]],
    text: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(2000)
      ]
    ],
  });

  ngOnInit(): void {
    // clear backend errors while typing
    this.forumForm.valueChanges.subscribe(() => {
      this.postError.set(null);
    });
  }

  public createPost(event: Event) {
    event.preventDefault();

    if (this.forumForm.invalid) {
      this.forumForm.markAllAsTouched();
      return;
    }

    const { title, subject, text } = this.forumForm.value;

    this.apiService.createPost(title!, subject!, text!).subscribe({
      next: () => {
        window.location.href = '/forum';
      },

      error: (err) => {
        console.error('Error creating post -> ', err.error.error);
        this.postError.set(err.error.error);
      }
    });
  }
}
