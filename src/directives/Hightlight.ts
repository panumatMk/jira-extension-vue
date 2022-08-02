export const hightlight = {
  mounted: (el: any, binding: any) => {
    const text = binding.value.text;
    el.innerHTML = text;
  },
  updated(el: any, binding: any) {
    const search = binding.value.search;
    const text = binding.value.text;
    if(!search) {
      el.innerHTML = text;
      return;
    }
    const re = new RegExp(search, 'igm');
    el.innerHTML = text.replace(re, '<span class="highlighted-text">$&</span>');
  }
};