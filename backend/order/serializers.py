from rest_framework import serializers
from .models import Order, OrderItem
from inventory.serializers import ItemSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'item_id', 'item_name', 'quantity', 'unit_price', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, source='order_items')
    location_name = serializers.CharField(source='location.name', read_only=True)
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'store_id', 'location_id', 'location_name', 'user_id',
            'employee_id', 'employee_name', 'order_date', 'status',
            'total_amount', 'payment_status', 'items', 'customer_name',
            'customer_phone', 'customer_email', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class CreateOrderSerializer(serializers.ModelSerializer):
    items = serializers.ListField(child=serializers.DictField(), write_only=True)

    class Meta:
        model = Order
        fields = [
            'customer_name', 'customer_phone',
            'customer_email', 'items'
        ]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("At least one item is required")
        return items

    def create(self, validated_data):
        try:
            items_data = validated_data.pop('items')
            order = Order.objects.create(**validated_data)

            total_amount = 0
            for item_data in items_data:
                quantity = int(item_data['quantity'])
                unit_price = float(item_data['unit_price'])
                subtotal = quantity * unit_price
                total_amount += subtotal

                OrderItem.objects.create(
                    order=order,
                    item_id=item_data['item'],
                    quantity=quantity,
                    unit_price=unit_price,
                    subtotal=subtotal
                )

            order.total_amount = total_amount
            order.save()
            return order
        except Exception as e:
            print("[CreateOrderSerializer.create] Error:", str(e))
            raise serializers.ValidationError(str(e))