import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss']
})
export class ColumnFilterComponent {

  @Input() selectColumnOptions: any = [];
  @Input() defaultSelectedColumn = '';
  @Input() isLoading = false;

  @Output() selectColumnChanged = new EventEmitter<string>();
  @Output() filterTextChanged = new EventEmitter<string>();
  @Output() filterTextCleared = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput: any;

  onSelectColumnChanged(column: string): void {
    this.selectColumnChanged.emit(column);
  }

  onFilterApplied(event: KeyboardEvent): void {
    this.filterTextChanged.emit((event.target as HTMLInputElement).value);
  }

  onClearSearchInputClicked(): void {
    this.searchInput.nativeElement.value = '';
    this.filterTextCleared.emit('');
  }

}
