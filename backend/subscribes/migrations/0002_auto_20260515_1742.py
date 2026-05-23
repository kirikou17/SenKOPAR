from django.db import migrations

def create_default_plans(apps, schema_editor):
    Plan = apps.get_model('subscribes', 'Plan')
    Plan.objects.bulk_create([
        Plan(nom_plan="Gratuit", prix_plan=0),
        Plan(nom_plan="Standard", prix_plan=5000),
        Plan(nom_plan="Pro", prix_plan=15000),
    ])

class Migration(migrations.Migration):
    dependencies = [ ('subscribes', '0001_initial'), ]
    operations = [ migrations.RunPython(create_default_plans), ]