import { NodeListener } from '../types';
import { STNode } from '../core';

export class ExpansionListener<S, A> implements NodeListener<S, A> {
  private count = 0;

  update(_node: STNode<S, A>) {
    this.count++;
  }

  getCount() {
    return this.count;
  }
}
