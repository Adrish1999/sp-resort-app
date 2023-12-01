import { Component, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-food-slider',
  templateUrl: './food-slider.component.html',
  styleUrls: ['./food-slider.component.css']
})
export class FoodSliderComponent implements OnInit {

  @ViewChild('.gallery-slider') newSwiper: any;

  constructor() {
  }

  ngOnInit(): void {
    this.newSwiper = new Swiper('.gallery-slider', {
      speed: 400,
      loop: true,
      observer: true,
      observeParents: true,
      centeredSlides: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        992: {
          slidesPerView: 5,
          spaceBetween: 20
        }
      }
    });
  }
}
