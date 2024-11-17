import { AfterViewInit, Component, inject, input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CountryClient } from '../services/api';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
  private countryClient = inject(CountryClient);
  public userId = input.required<number>();

  public async ngAfterViewInit() {
    const root = am5.Root.new('chartdiv');

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'none',
        panY: 'none',
        wheelY: 'none',
        minZoomLevel: 1,
        maxZoomLevel: 16,
        projection: am5map.geoNaturalEarth1(),
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
      })
    );

    polygonSeries.set('fill', am5.color(0x2c3441));

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: '{name}',
      templateField: 'polygonSettings',
    });

    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: am5.color(0xca895f),
    });

    const countryCodes = await firstValueFrom(
      this.countryClient.getAllCountryCodes(this.userId())
    );

    const countriesWithSettings: any[] = [];

    countryCodes.forEach((code) => {
      countriesWithSettings.push({
        id: code,
        polygonSettings: {
          fill: am5.color(0x677935),
        },
      });
    });

    polygonSeries.data.setAll(countriesWithSettings);
  }
}
