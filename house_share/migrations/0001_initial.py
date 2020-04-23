# Generated by Django 3.0.5 on 2020-04-23 13:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('house_name', models.CharField(max_length=30)),
                ('house_number', models.IntegerField()),
                ('street', models.CharField(max_length=30)),
                ('street_two', models.CharField(max_length=30)),
                ('town', models.CharField(max_length=30)),
                ('city', models.CharField(max_length=30)),
                ('postcode', models.CharField(max_length=10)),
                ('country', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=40)),
                ('description', models.CharField(blank=True, max_length=200)),
                ('expense_dated', models.DateField()),
                ('date_from', models.DateField(null=True)),
                ('date_to', models.DateField(null=True)),
                ('amount', models.FloatField()),
                ('payment_due_date', models.DateField(null=True)),
                ('image', models.ImageField(null=True, upload_to='bill_image')),
                ('admin_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='expense', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Residence',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('short_name', models.CharField(max_length=30, unique=True)),
                ('address', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='residences', to='house_share.Address')),
                ('admin_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='residence', to=settings.AUTH_USER_MODEL)),
                ('join_requests', models.ManyToManyField(related_name='new_residence', to=settings.AUTH_USER_MODEL)),
                ('past_tenants', models.ManyToManyField(related_name='past_residences', to=settings.AUTH_USER_MODEL)),
                ('tenants', models.ManyToManyField(related_name='residences', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Split',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('percentage_to_pay', models.FloatField()),
                ('paid_flag', models.BooleanField()),
                ('admin_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='split', to=settings.AUTH_USER_MODEL)),
                ('expense', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='splits', to='house_share.Expense')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='splits', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('available_from', models.DateField()),
                ('for_duration', models.CharField(max_length=25)),
                ('room_details', models.CharField(max_length=250)),
                ('image', models.ImageField(null=True, upload_to='room_image')),
                ('cost_per_week', models.FloatField()),
                ('admin_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rooms', to=settings.AUTH_USER_MODEL)),
                ('residence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rooms', to='house_share.Residence')),
            ],
        ),
        migrations.CreateModel(
            name='Move',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('moved_in', models.DateField()),
                ('moved_out', models.DateField(null=True)),
                ('status', models.CharField(max_length=30)),
                ('residence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moves', to='house_share.Residence')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moves', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='expense',
            name='residence',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='expenses', to='house_share.Residence'),
        ),
    ]
