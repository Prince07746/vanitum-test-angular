import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Service {
  label: string;
  slug: string;
  color: string;
}

interface ServiceState {
  url: string;
  callSlug: string;
  loading: boolean;
  error: string | null;
  result: unknown;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  services: Service[] = [
    { label: 'Node.js API',     slug: 'vanitum-test-node',   color: '#68a063' },
    { label: 'Spring Boot API', slug: 'vanitum-test-spring', color: '#6db33f' },
    { label: 'Python API',      slug: 'vanitum-test-python',  color: '#3776ab' },
  ];

  states: { [slug: string]: ServiceState } = Object.fromEntries(
    this.services.map(s => [s.slug, {
      url: '', callSlug: '', loading: false, error: null, result: null
    }])
  );

  constructor(private http: HttpClient) {}

  st(slug: string): ServiceState {
    return this.states[slug];
  }

  probe(slug: string, path: string): void {
    const s = this.st(slug);
    if (!s.url) return;
    s.loading = true; s.error = null; s.result = null;
    this.http.get(s.url.replace(/\/$/, '') + path).subscribe({
      next: data => { s.result = data; s.loading = false; },
      error: err => { s.error = err.message; s.loading = false; }
    });
  }

  probeCall(slug: string): void {
    const s = this.st(slug);
    if (s.callSlug) this.probe(slug, `/call/${s.callSlug}`);
  }

  stringify(data: unknown): string {
    return JSON.stringify(data, null, 2);
  }
}
